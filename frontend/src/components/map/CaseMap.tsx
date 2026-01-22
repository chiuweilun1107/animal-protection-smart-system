import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createMapIcon } from '../../utils/mapIcons';
import { type LatLngTuple } from 'leaflet';


export interface CaseMarker {
    id: string;
    lat: number;
    lng: number;
    type: 'general' | 'bee';
    title: string;
    status: 'pending' | 'processing' | 'resolved';
    address: string;
    reporter: string;
    photoUrl?: string; // Optional photo
    description?: string;
}

interface CaseMapProps {
    cases: CaseMarker[];
    activeLayer?: 'osm' | 'satellite' | 'dark';
    center?: LatLngTuple;
    zoom?: number;
}

const DEFAULT_CENTER: LatLngTuple = [25.0118, 121.4658];

// Internal component to handle view updates without remounting the container
const MapUpdater: React.FC<{ center?: LatLngTuple; zoom?: number }> = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom(), {
                animate: true,
                duration: 1
            });
        }
    }, [center, zoom, map]);

    useEffect(() => {
        // Handle potential container size changes (e.g., panel toggles)
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 300);
        return () => clearTimeout(timer);
    }, [map]);

    return null;
};

export const CaseMap: React.FC<CaseMapProps> = ({ cases, activeLayer = 'osm', center, zoom }) => {

    const getIconColor = (type: string, status: string) => {
        if (status === 'resolved') return 'green';
        if (type === 'bee') return 'orange';
        return 'red'; // general + pending/processing
    };

    const handleRoutePlanning = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    const handleDispatch = (id: string, title: string) => {
        const event = new CustomEvent('openDispatch', { detail: { id, title } });
        window.dispatchEvent(event);
    };

    const getTileLayer = () => {
        switch (activeLayer) {
            case 'satellite':
                return (
                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                );
            case 'dark':
                return (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                );
            case 'osm':
            default:
                return (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                );
        }
    };

    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-slate-200 shadow-md">
            <MapContainer
                center={center || DEFAULT_CENTER}
                zoom={zoom || 12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <MapUpdater center={center} zoom={zoom} />
                {getTileLayer()}

                {cases.map((c) => (
                    <Marker
                        key={c.id}
                        position={[c.lat, c.lng]}
                        icon={createMapIcon(getIconColor(c.type, c.status) as any, 24)}
                    >
                        <Popup className="custom-popup">
                            <div className="min-w-[240px] p-1">
                                {c.photoUrl && (
                                    <div className="mb-3 rounded-lg overflow-hidden relative aspect-video group">
                                        <img src={c.photoUrl} alt="現場照片" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${c.type === 'bee' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                    <span className="font-bold text-slate-800 text-sm">{c.type === 'bee' ? '蜂案通報' : '一般案件'}</span>
                                    <span className={`ml-auto text-base px-2 py-0.5 rounded-full border font-medium ${c.status === 'resolved' ? 'bg-green-50 border-green-200 text-green-700' :
                                        c.status === 'processing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                            'bg-red-50 border-red-200 text-red-700'
                                        }`}>
                                        {c.status === 'resolved' ? '已結案' : c.status === 'processing' ? '處理中' : '待處理'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight tracking-tight">{c.title}</h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-start gap-2 text-xs text-slate-600">
                                        <span className="font-bold text-slate-400 shrink-0">地點</span>
                                        <span className="leading-relaxed">{c.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <span className="font-bold text-slate-400 shrink-0">通報</span>
                                        <span>{c.reporter}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                    <button
                                        onClick={() => handleRoutePlanning(c.lat, c.lng)}
                                        className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                                    >
                                        路線規劃
                                    </button>
                                    <button
                                        onClick={() => handleDispatch(c.id, c.title)}
                                        className="flex-1 bg-slate-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all shadow-md active:scale-95"
                                    >
                                        指派任務
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
