import { trickData } from '../common/variables';
export { getTrickCommands as default };

function getTrickCommands(router, trickClient) {
    router.get('/data/*', (req, res) => {
        // Return list of hardcoded trick commands
    });
}