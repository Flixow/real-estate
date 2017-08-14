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

      exec('git -C ~/Public/real-estate reset --hard', execCallback)
      exec('git -C ~/Public/real-estate clean -df', execCallback)
      exec('git -C ~/Public/real-estate pull -f', execCallback)
      exec('yarn -C ~/Public/real-estate install --prod', execCallback)
      console.log('Installing production dependencies')
      exec('yarn -C ~/Public/real-estate install start', execCallback)
      console.log('Installed production dependencies')
    } else {
      console.log(`${req.body.pusher.name} just pushed to ${req.body.repository.name} on branch ${branch}`)
    }
  } catch (e) {
    console.log('error:', e)
  }
}
