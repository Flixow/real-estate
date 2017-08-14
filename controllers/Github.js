const exec = require('child_process').exec

exports.payload = (req, res) => {
  if (res.body.ref.includes('master')) {
    console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name)
    console.log('pulling code from GitHub...')

    const execCallback = (err, stdout, stderr) => {
      if(stdout) console.log(stdout)
      if(stderr) console.log(stderr)
    }

    exec('git -C ~/Public/real-estate reset --hard', execCallback)
    exec('git -C ~/Public/real-estate clean -df', execCallback)
    exec('git -C ~/Public/real-estate pull -f', execCallback)
    exec('yarn -C ~/Public/real-estate install --prod', execCallback)
    exec('yarn -C ~/Public/real-estate install start', execCallback)
  }
}
