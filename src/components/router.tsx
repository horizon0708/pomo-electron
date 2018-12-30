import React, { ReactNode, PureComponent, ComponentType, Component, ReactElement } from 'react'
import { inject, observer } from 'mobx-react';
import PomoStore from '../stores/pomoStore';
import AppStateStore from '../stores/appStateStore';


//https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Switch.js
@inject("appState")
@observer
export class Router extends Component<{ appState?: AppStateStore }, {}> {

    render() {
        return <div>
            {this.renderMatchingRoute()}
        </div>
    }

    renderMatchingRoute() {
        const { appState } = this.props
        if(!appState) return null
        if (!this.props.children) return null
        let matchedComponent
        React.Children.forEach(this.props.children, child => {
            if (React.isValidElement(child)) {
                const element = child as ReactElement<any & InjectedPageProps>
                if (element.props.route === appState.route) {
                    matchedComponent = child
                }
            }
        })
        if(matchedComponent) return matchedComponent
        return <div>no matching route error</div>
    }
}



export interface InjectedPageProps {
    route: PomoPage
}

export enum PomoPage {
    today,
    project,
    notes,
    options,
    donate
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

//https://stackoverflow.com/questions/49329847/typescript-and-react-hoc-high-order-components
//https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb

// redundant HOC. above solutions didn't work out, working with Route atm
export const withRoute = <P extends InjectedPageProps>(Component: ComponentType<P & any>, route: PomoPage)=> {
    return class withRoute extends React.Component<Subtract<P, InjectedPageProps>, {}> {
        render() {
            return <Component {...this.props} route={route} />
        }
    }
}

export const Route: React.SFC<InjectedPageProps> = ({ children }) => {
    const child = React.Children.only(children)
    return child
}

