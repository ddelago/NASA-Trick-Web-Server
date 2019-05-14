import { clearMap, clearChannels } from '../../common/variables';
export { clearVariables as default };

function clearVariables(router, trickClient) {
    router.put('/cmd/clearVariables', (req, res) => {

        // Remove from TWS
        clearMap();
        clearChannels();
        
        // Clear Trick stream. USED WHEN CHANGING DISPLAYS. 
        trickClient.pause();
        trickClient.write('trick.var_clear()\n');
        trickClient.resume();

        res.send({
            "status": "SUCCESS"
        });
   });
}