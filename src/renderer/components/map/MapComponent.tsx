import React, { useMemo } from "react";
import { GoogleMap, Polygon, Marker, useLoadScript, Rectangle, Polyline } from "@react-google-maps/api";
import { GetEnvironmentVariable } from "../../../misc/get_env";
import { Environment } from "../../../domain/Environment";
import { DroneSession, SessionList } from "../../../domain/Session";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const center = {
    lat: 38.75618649430114,
    lng: -9.116565341401213,
};

const mapStyles = [
    {
        featureType: "poi",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi.place_of_worship",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi.school",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "poi.sports_complex",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "transit.station.bus",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "transit.station.rail",
        stylers: [{ visibility: "off" }],
    },
];

const options = {
    disableDefaultUI: true,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    styles: mapStyles,
};

type MapComponentProps = {
    environment: Environment;
    session_list: SessionList;
};

export function MapComponent({ environment, session_list }: MapComponentProps) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GetEnvironmentVariable("GOOGLE_MAPS_API_KEY") || "",
    });

    const mapId = "71d24807b85f1bb3"; // Your custom Map ID

    // Convert the environment perimeter into a format for Google Maps API
    const path = useMemo(() => {
        return environment.perimeter.map((coordinate) => ({
            lat: coordinate.lat,
            lng: coordinate.lng,
        }));
    }, [environment]);

    // Convert session coordinates into markers
    const markers = useMemo(() => {
        return session_list.sessions.map((session) => ({
            id: session.agent_id,
            position: {
                lat: session.coordinates.lat,
                lng: session.coordinates.lng,
            },
        }));
    }, [session_list]);

    // Convert environment cells into rectangles
    const rectangles = useMemo(() => {
        return environment.cells.map((cell) => ({
            north: cell.north_west_corner.lat,
            south: cell.north_west_corner.lat - cell.size_degrees,
            east: cell.north_west_corner.lng + cell.size_degrees,
            west: cell.north_west_corner.lng,
        }));
    }, [environment]);

    // Get waypoints and target for each session with a mission
    const missions = useMemo(() => {
        return session_list.sessions
            .filter(session => session.mission) // Only sessions with a mission
            .map(session => ({
                id: session.agent_id,
                waypoints: session.mission!.waypoints.map((wp) => ({
                    lat: wp.lat,
                    lng: wp.lng,
                })),
                target: {
                    lat: session.mission!.target.lat,
                    lng: session.mission!.target.lng,
                }
            }));
    }, [session_list]);

    if (!isLoaded) {
        return (
            <div>
                <p>Loading ...</p>
            </div>
        );
    }

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                // @ts-ignore: Ignore TypeScript error for this line
                mapId={mapId}
                center={center}
                zoom={15}
                options={options}
            >
                {/* Render the environment polygon */}
                <Polygon
                    path={path}
                    options={{
                        fillColor: "#FF0000",
                        fillOpacity: 0.1,
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                    }}
                />

                {/* Render a marker for each session */}
                {markers.map((marker) => (
                    <Marker key={marker.id} position={marker.position} />
                ))}

                {/* Render a rectangle for each environment cell */}
                {rectangles.map((bounds, index) => (
                    <Rectangle
                        key={index}
                        bounds={bounds}
                        options={{
                            fillColor: "#00FF00",
                            fillOpacity: 0.1,
                            strokeColor: "#00FF00",
                            strokeOpacity: 0.5,
                            strokeWeight: 2,
                        }}
                    />
                ))}

                {/* Render waypoints and target for each mission */}
                {missions.map(mission => (
                    <React.Fragment key={mission.id}>
                        {/* Render target marker */}
                        <Marker
                            position={mission.target}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            }}
                        />
                        {/* Render waypoints as a polyline */}
                        <Polyline
                            path={mission.waypoints}
                            options={{
                                strokeColor: "#0000FF",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                            }}
                        />
                    </React.Fragment>
                ))}
            </GoogleMap>
        </div>
    );
}
