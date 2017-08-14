const exec = require('child_process').exec

exports.payload = (req, res) => {
  //verify that the payload is a push from the correct repo
	//verify repository.name == 'real-estate' or repository.full_name = 'Flixow/real-estate'
	console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name)

	console.log('pulling code from GitHub...')
  function execCallback(err, stdout, stderr) {
  	if(stdout) console.log(stdout)
  	if(stderr) console.log(stderr)
  }

	// reset any changes that have been made locally
	exec('git -C ~/Public/real-estate reset --hard', execCallback)

	// and ditch any files that have been added locally too
	exec('git -C ~/Public/real-estate clean -df', execCallback)

	// now pull down the latest
	exec('git -C ~/Public/real-estate pull -f', execCallback)

	// and npm install with --production
	exec('npm -C ~/Public/real-estate install --production', execCallback)

	// and run tsc
	exec('tsc', execCallback)
}
