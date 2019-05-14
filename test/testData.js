var optionsInOut = {
	"/data/*": 	[
					"dyn",
					"trick_cmd_args",
					"trick_cpr",
					"trick_data_record",
					"trick_dmtcp",
					"trick_em",
					"trick_frame_log",
					"trick_inject",
					"trick_instruments",
					"trick_ip",
					"trick_jit",
					"trick_master_slave",
					"trick_mc",
					"trick_message",
					"trick_mm",
					"trick_real_time",
					"trick_sie",
					"trick_sys",
					"trick_udunits",
					"trick_utest",
					"trick_vs",
					"trick_zero_conf"
				], 
	"/data/dyn/*": 	[
						"satellite"
					], 
	"/data/dyn/**": [
						"satellite/",
						"satellite/pos[0]",
						"satellite/pos[1]",
						"satellite/vel[0]",
						"satellite/vel[1]",
						"satellite/acc[0]",
						"satellite/acc[1]"
					] 
};

var getInOut = {
	"/data/dyn/satellite/pos[0]": 	{
										"channel": "dyn/satellite/pos[0]",
										"data": ""
									}, 
	"/data/dyn/satellite/pos[1]": 	{
										"channel": "dyn/satellite/pos[1]",
										"data": ""
									}
};

var postInOut = [{
					"channels": [
						"dyn/satellite/pos[1]",
						"dyn/satellite/vel[0]",
						"dyn/satellite/vel[1]",
						"dyn/satellite/acc[0]",
						"dyn/satellite/acc[1]"
					]
				}];

var putInOut = {
	"/data/dyn/satellite/pos[0]": , 
	"/data/dyn/satellite/pos[1]": 
};

var deleteInOut = {
	"/data/dyn/satellite/pos[0]": , 
	"/data/dyn/satellite/pos[1]": 
};



module.exports = {
    optionsInOut,
    getInOut,
    postInOut,
    putInOut,
	deleteInOut
};