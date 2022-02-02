import * as React from 'react'
import {useSpring, animated} from 'react-spring'
import {useWheel} from 'react-use-gesture'
import {geoOrthographic, geoPath, GeoProjection} from 'd3-geo'
import {feature} from 'topojson-client'
import {FeatureCollection} from 'geojson'
import jsonData from './countries-110m.json'
import {map, clamp, isEmpty} from 'lodash'
import './globe.css'

type IGlobeProps = {
  lat: number
  lng: number
  zoom: number
  size: number
  onGlobeClick: (lat: number, lng: number) => void
  currentLocation: {
    userLng: number
    userLat: number
  }
}

const isProjectionInvertDefined = (
  projection: GeoProjection,
): projection is GeoProjection & Required<Pick<GeoProjection, 'invert'>> => {
  return typeof projection.invert !== 'undefined'
}

const Countries = ( //@ts-ignore
  feature(jsonData, jsonData.objects.countries) as unknown as FeatureCollection
).features

const Globe = animated(
  ({
    lat = 0,
    lng = 0,
    zoom,
    size = 400,
    onGlobeClick,
    currentLocation,
  }: IGlobeProps) => {
    const svgref = React.useRef<SVGSVGElement>(null)
    const projection = React.useMemo(() => {
      return geoOrthographic()
        .translate([size / 2, size / 2])
        .scale((size / 2) * zoom)
        .clipAngle(90)
        .rotate([-lat, -lng])
    }, [size, lat, lng, zoom])

    const pathgen = geoPath(projection)

    const pinSize = size / 60 / zoom

    const currentCoordinates: [number, number] = [
      currentLocation.userLng,
      currentLocation.userLat,
    ]

    // Check if it's behind the globe
    const isPinVisible = pathgen({
      type: 'Point',
      coordinates: currentCoordinates,
    })

    return (
      <svg ref={svgref} width={size} height={size}>
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
          style={{cursor: 'pointer'}}
          onClick={e => {
            if (!svgref.current) {
              return
            }

            const rect = svgref.current.getBoundingClientRect()

            const [lat, lng] = isProjectionInvertDefined(projection)
              ? projection.invert([
                  e.pageX - rect.left,
                  e.pageY - rect.top,
                ]) ?? [0, 0]
              : [0, 0]

            onGlobeClick.call(null, lat, lng)
          }}
        />
        <g style={{pointerEvents: 'none'}}>
          {map(Countries, (d, i) => (
            <path
              fill="#63A2FF"
              stroke="#5891E5"
              key={`path-${i}`}
              d={pathgen(d) ?? undefined}
            />
          ))}
        </g>
        {currentLocation.userLat &&
          !isEmpty(isPinVisible) &&
          [0, 1].map(pin => {
            const projections = projection(currentCoordinates)

            return (
              <circle
                key={pin}
                className={`pin-${pin}`}
                cx={(projections ?? [])[0]}
                cy={(projections ?? [])[1]}
                r={pinSize >= 15 ? 5 : size / 60 / zoom}
                fill="#fff"
              />
            )
          })}
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

  const canvasRef = React.useRef<HTMLDivElement>(null)

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
