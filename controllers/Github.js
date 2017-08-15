const exec = require('child_process').exec

exports.payload = (req, res) => {
  try {
    const branch = req.body.ref.split('/')[2]

    if (branch === 'master') {
      console.log(`${req.body.pusher.name} just pushed to ${req.body.repository.name} on branch ${branch}`)
      console.log('pulling code from GitHub...')

      const execCallback = (err, stdout, stderr) => {
        if(stdout) console.log(stdout)
        if(stderr) console.log(stderr)
      }

      exec('git -C ~/Public/real-estate fetch origin master', execCallback)
      exec('git -C ~/Public/real-estate reset --hard FETCH_HEAD', execCallback)
      exec('git -C ~/Public/real-estate clean -df', execCallback)
      console.log('Installing production dependencies')
      exec('npm -C ~/Public/real-estate install --production', execCallback)
      console.log('Installed production dependencies')
      console.log('Restart forever real-estate process')
      exec('forever -C ~/Public/real-estate restart real-estate', execCallback)
      res.sendStatus(200)
    } else {
      console.log(`${req.body.pusher.name} just pushed to ${req.body.repository.name} on branch ${branch}`)
      res.sendStatus(400)
    }
  } catch (e) {
    console.log('error:', e)
    res.sendStatus(400)
  }
}
