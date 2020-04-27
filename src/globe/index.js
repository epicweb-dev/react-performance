import React from 'react'
import {useSpring, animated} from 'react-spring'
import {useWheel} from 'react-use-gesture'
import {geoOrthographic, geoPath} from 'd3-geo'
import {feature} from 'topojson-client'
import jsonData from './countries-110m.json'
import {map, clamp, isEmpty} from 'lodash'
import './globe.css'

const Countries = feature(jsonData, jsonData.objects.countries).features

const Globe = animated(
  ({lat = 0, lng = 0, zoom, size = 400, onGlobeClick, currentLocation}) => {
    const svgref = React.useRef()
    const projection = React.useMemo(() => {
      return geoOrthographic()
        .translate([size / 2, size / 2])
        .scale((size / 2) * zoom)
        .clipAngle(90)
        .rotate([-lat, -lng])
    }, [size, lat, lng, zoom])

    const pathgen = geoPath(projection)
    const currentCoordinates = [
      currentLocation.userLng,
      currentLocation.userLat,
    ]
    const pinSize = size / 60 / zoom
    // Check if it's behind the globe
    const isPinVisible = pathgen({
      type: 'Point',
      coordinates: [currentCoordinates[0], currentCoordinates[1]],
    })

    return (
      <svg ref={svgref} width={size} height={size} title="globe">
        <defs>
          <radialGradient
            id="gradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" style={{stopColor: '#325181', stopOpacity: 1}} />
            <stop
              offset="100%"
              style={{stopColor: '#293E5F', stopOpacity: 1}}
            />
          </radialGradient>
        </defs>
        <circle
          fill="url(#gradient)"
          cx={size / 2}
          cy={size / 2}
          r={(size / 2) * zoom}
          onClick={e => {
            let rect = svgref.current.getBoundingClientRect()
            const [lat, lng] = projection.invert([
              e.pageX - rect.left,
              e.pageY - rect.top,
            ])
            onGlobeClick.call(null, lat, lng)
          }}
          style={{cursor: 'pointer'}}
        />
        <g style={{pointerEvents: 'none'}}>
          {map(Countries, (d, i) => (
            <path
              fill="#63A2FF"
              stroke="#5891E5"
              key={`path-${i}`}
              d={pathgen(d)}
            />
          ))}
        </g>
        {currentLocation.userLat &&
          !isEmpty(isPinVisible) &&
          [0, 1].map(pin => (
            <circle
              key={pin}
              className={`pin-${pin}`}
              cx={projection(currentCoordinates)[0]}
              cy={projection(currentCoordinates)[1]}
              r={pinSize >= 15 ? 5 : size / 60 / zoom}
              fill="#fff"
            />
          ))}
      </svg>
    )
  },
)

function GlobeContainer({size = 400}) {
  const [state, setState] = React.useState({
    lat: 0,
    lng: 0,
    userLat: 0,
    userLng: 0,
  })

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(position =>
      setState({
        userLng: position.coords.longitude,
        userLat: position.coords.latitude,
        lat: position.coords.longitude,
        lng: position.coords.latitude,
      }),
    )
  }, [setState])

  // Panning
  const {lat, lng} = useSpring({
    lat: state.lat,
    lng: state.lng,
  })

  // Zooming (use cmd/ctrl + scroll to zoom)
  const [zoom, setZoom] = React.useState({
    wheeling: false,
    scale: 1,
  })

  const canvasRef = React.useRef()

  const bind = useWheel(
    ({wheeling, metaKey, delta: [deltaX, deltaY], event}) => {
      if (metaKey && event) {
        const newScale = clamp(zoom.scale + deltaY / 600, 0.2, 10)

        setZoom({
          ...zoom,
          scale: newScale,
          wheeling,
        })
      } else {
        setZoom({
          ...zoom,
          wheeling,
        })
      }
    },
  )

  return (
    <div {...bind()} ref={canvasRef}>
      <Globe
        lat={lat}
        lng={lng}
        zoom={zoom.scale}
        currentLocation={{userLat: state.userLat, userLng: state.userLng}}
        size={size}
        onGlobeClick={(lat, lng) => {
          setState({
            ...state,
            lat,
            lng,
          })
        }}
      />
    </div>
  )
}

export default GlobeContainer
