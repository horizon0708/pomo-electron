import PomoStore from "../stores/pomoStore";
import { TEST_DB_NAME } from "../constants/databaseConstants";

let store: PomoStore
let counter = 0

beforeEach(()=> {
    store = new PomoStore(TEST_DB_NAME + "_" + counter)
    counter++
})


test("Insert Project", () => {
    store.projectManager.add
})