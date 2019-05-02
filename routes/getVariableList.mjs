import { trickData } from '../common/variables';
export { getVariableList as default };

function getVariableList(router, trickClient) {
    router.get('/data/*', (req, res) => {
        // Return list of all variables?
    });
}