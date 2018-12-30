import React from 'react'

enum SubmitResult {
    start,
    success,
    inProgress,
    fail
}

class Validation extends React.Component {
    state ={
        validState: SubmitResult.start
    }

    
}