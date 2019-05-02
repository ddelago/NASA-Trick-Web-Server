import { trickData } from '../common/variables';
export { getBatchVariables as default };

function getBatchVariables(router, trickClient) {
    router.post('/data', (req, res) => {

        var oldValue = trickData;

        // Send command to Trick
        trickClient.write(`trick.var_add(\"${trickVariable}\")\n`);

        function wait() {
            // If old data, wait
            if(trickData === oldValue) {
                setTimeout(wait, 10);
                return;
            }
            res.send({
                "channel": trickVariable,
                "data": trickData,
            });
        }

        // Wait for new value to be updated
        wait();
   });
}