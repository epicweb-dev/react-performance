// This module is just here for the exercise and doesn't actually do anything.
// In reality, what I would recommend for a function like this is that it keeps
// a queue of all updates and every 10 seconds it sends profile data to your
// server if there's any data in the queue.
// Then you presumably graph that data in Grafana or similar
let queue = []

// we're doing every 5 seconds so we don't have to wait forever...
// actual time may vary based on your app's needs
setInterval(sendProfileQueue, 5000)

function reportProfile(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions, // the Set of interactions belonging to this update
) {
  queue.push({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  })
  // this is a fire and forget, so we don't return anything.
}

function sendProfileQueue() {
  if (!queue.length) {
    return Promise.resolve()
  }
  const queueToSend = [...queue]
  queue = []
  console.info('sending profile queue', queueToSend)
  // here's where we'd actually make the server call to send the queueToSend
  // data to our backend... But we don't have a backend for this workshop so...
  return Promise.resolve()
}

export default reportProfile
