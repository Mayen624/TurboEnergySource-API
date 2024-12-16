import { v4 as uuidv4 } from "uuid"

function getUUID() {
    return uuidv4();
}
  
const functions = {
    getUUID
};
  
export default functions;