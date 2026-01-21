import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createMapIcon } from '../../utils/mapIcons';
import { type LatLngTuple } from 'leaflet';
import { Link } from 'react-router-dom';

export interface CaseMarker {
    id: string;
    lat: number;
    lng: number;
    type: 'general' | 'bee';
    title: string;
    status: 'pending' | 'processing' | 'resolved';
}

interface CaseMapProps {
    cases: CaseMarker[];
}

const DEFAULT_CENTER: LatLngTuple = [25.0118, 121.4658];

export const CaseMap: React.FC<CaseMapProps> = ({ cases }) => {

    const getIconColor = (type: string, status: string) => {
        if (status === 'resolved') return 'green';
        if (type === 'bee') return 'orange';
        return 'red'; // general + pending/processing
    };

    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-slate-200 shadow-md">
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributor'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {cases.map((c) => (
                    <Marker
                        key={c.id}
                        position={[c.lat, c.lng]}
                        icon={createMapIcon(getIconColor(c.type, c.status) as any, 24)}
                    >
                        <Popup>
                            <div className="p-1 min-w-[150px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`w-2 h-2 rounded-full ${c.type === 'bee' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                    <span className="font-bold text-slate-800">{c.type === 'bee' ? '蜂案' : '一般案件'}</span>
                                </div>
                                <h3 className="text-sm font-medium text-slate-700 mb-1">{c.title}</h3>
                                <div className="text-xs text-slate-500 mb-2">狀態: {c.status}</div>
                                <Link to={`/status?id=${c.id}`} className="text-xs text-primary-600 hover:underline">
                                    查看詳情
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
