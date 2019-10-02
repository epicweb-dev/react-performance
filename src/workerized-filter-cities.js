import makeFilterCitiesWorker from 'workerize!./filter-cities'

const {getItems} = makeFilterCitiesWorker()

export {getItems}

/*
eslint
  import/no-webpack-loader-syntax: 0,
*/
