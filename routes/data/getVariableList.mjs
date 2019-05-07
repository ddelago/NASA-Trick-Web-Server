import { trickVariableTree } from '../../common/variables';
export { getVariableList as default };

function getVariableList(router, trickClient) {
    router.get('/allVariables', (req, res) => {
        // Send JSON tree of all variables
        res.send(trickVariableTree);
    });
}