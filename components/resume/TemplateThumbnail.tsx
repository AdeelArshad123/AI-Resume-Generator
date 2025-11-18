
import React from 'react';

// Color palette for consistent visuals
const colors = {
    paper: '#ffffff',
    gray50: '#f9fafb',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray500: '#6b7280',
    gray700: '#374151',
    gray800: '#1f2937',
    primary: '#0ea5e9',
    emerald: '#10b981',
    green: '#22c55e',
    purple: '#a855f7',
    blue: '#3b82f6',
};

// SVG primitive components
const SvgRect: React.FC<{ x: number; y: number; width: number; height: number; fill: string; rx?: number; stroke?: string; strokeWidth?: number; fillOpacity?: number }> = (props) => (
    <rect {...props} />
);
const SvgCircle: React.FC<{ cx: number; cy: number; r: number; fill: string; fillOpacity?: number }> = (props) => (
    <circle {...props} />
);

// SVG composite components for text representation
const TextLine: React.FC<{ x: number; y: number; width: number; fill: string }> = ({ x, y, width, fill }) => (
    <SvgRect x={x} y={y} width={width} height={1.5} fill={fill} rx={0.5} />
);
const TextBlock: React.FC<{ x: number; y: number; width: number; lines: number; fill: string; shortLast?: boolean }> = ({ x, y, width, lines, fill, shortLast = true }) => (
    <g>
        {Array.from({ length: lines }).map((_, i) => (
            <TextLine
                key={i}
                x={x}
                y={y + i * 3}
                width={i === lines - 1 && shortLast ? width * 0.8 : width}
                fill={fill}
            />
        ))}
    </g>
);
const Section: React.FC<{ y: number, x?: number, width?: number, headColor?: string, bodyColor?: string }> = ({ y, x=8, width=69, headColor=colors.gray700, bodyColor=colors.gray300 }) => (
    <g>
        <SvgRect x={x} y={y} width={width*0.3} height={2.5} fill={headColor} />
        <TextBlock x={x} y={y + 6} width={width} lines={4} fill={bodyColor} />
    </g>
);
const SidebarSection: React.FC<{ y: number, headColor?: string, bodyColor?: string }> = ({ y, headColor=colors.gray500, bodyColor=colors.gray200 }) => (
    <g>
        <SvgRect x={5} y={y} width={18} height={2} fill={headColor} />
        <TextBlock x={5} y={y+5} width={18} lines={2} fill={bodyColor} />
    </g>
);

// High-fidelity, representative SVG thumbnail component
const TemplateThumbnail: React.FC<{ templateId: string }> = ({ templateId }) => {
    
    const svgWrapperProps = {
        width: "100%",
        height: "100%",
        viewBox: "0 0 85 110",
        preserveAspectRatio: "xMidYMin slice"
    };

    const renderTemplate = () => {
        switch (templateId) {
            // --- Single Column ---
            case 'classic': return <svg {...svgWrapperProps}><g transform="translate(0, 5)"><SvgRect x={22.5} y={10} width={40} height={4} fill={colors.gray700} /><SvgRect x={12.5} y={16} width={60} height={1.5} fill={colors.gray500} /><SvgRect x={10} y={22} width={65} height={0.5} fill={colors.gray700} /><Section y={30} /><Section y={55} /></g></svg>;
            case 'modern': return <svg {...svgWrapperProps}><g transform="translate(5, 10)"><SvgRect x={0} y={0} width={40} height={4} fill={colors.gray700} /><SvgRect x={0} y={6} width={75} height={0.75} fill={colors.primary} /><Section y={15} headColor={colors.primary} /><Section y={40} headColor={colors.primary} /></g></svg>;
            case 'minimalist': return <svg {...svgWrapperProps}><g transform="translate(8, 10)"><SvgRect x={0} y={0} width={50} height={5} fill={colors.gray800} /><SvgRect x={0} y={7} width={30} height={1.5} fill={colors.gray500} /><SvgRect x={0} y={20} width={0.75} height={80} fill={colors.gray200} /><Section y={20} x={5} width={65} headColor={colors.gray800} /><Section y={45} x={5} width={65} headColor={colors.gray800} /></g></svg>;
            case 'professional': return <svg {...svgWrapperProps}><g transform="translate(0, 5)"><SvgRect x={22.5} y={10} width={40} height={4} fill={colors.gray700} /><SvgRect x={12.5} y={16} width={60} height={1.5} fill={colors.gray500} /><SvgRect x={10} y={22} width={65} height={0.5} fill={colors.gray700} /><SvgRect x={10} y={23} width={65} height={0.25} fill={colors.gray700} /><g transform="translate(0, 5)"><Section y={30} /><Section y={55} /></g></g></svg>;
            case 'tech': return <svg {...svgWrapperProps}><g transform="translate(8, 8)"><SvgRect x={0} y={0} width={40} height={4} fill={colors.gray700} /><SvgRect x={0} y={6} width={60} height={1.5} fill={colors.gray500} /><SvgRect x={0} y={12} width={69} height={0.5} fill={colors.gray200} /><Section y={20} /><Section y={45} /></g></svg>;
            case 'academic': return <svg {...svgWrapperProps}><g transform="translate(0, 5)"><SvgRect x={22.5} y={10} width={40} height={4} fill={colors.gray700} /><SvgRect x={12.5} y={16} width={60} height={1.5} fill={colors.gray500} /><SvgRect x={10} y={22} width={65} height={0.25} fill={colors.gray300} /><Section y={30} /><Section y={55} /></g></svg>;
            case 'cosmo': return <svg {...svgWrapperProps}><g transform="translate(0, 8)"><SvgCircle cx={42.5} cy={15} r={8} fill={colors.gray300} /><SvgRect x={22.5} y={26} width={40} height={4} fill={colors.gray700} /><SvgRect x={12.5} y={32} width={60} height={1.5} fill={colors.gray500} /><Section y={45} /><Section y={70} /></g></svg>;
            case 'vanguard': return <svg {...svgWrapperProps}><g transform="translate(8, 8)"><SvgRect x={0} y={0} width={69} height={18} fill={colors.primary} rx={2} /><SvgRect x={14.5} y={4} width={40} height={4} fill={colors.paper} /><SvgRect x={4.5} y={10} width={60} height={1.5} fill={colors.paper} /><Section y={28} headColor={colors.primary} /><Section y={53} headColor={colors.primary} /></g></svg>;
            case 'journal': return <svg {...svgWrapperProps}><SvgRect x={2} y={2} width={81} height={106} fill="none" stroke={colors.gray700} strokeWidth={1} /><g transform="translate(0, 5)"><SvgRect x={22.5} y={10} width={40} height={4} fill={colors.gray700} /><SvgRect x={12.5} y={16} width={60} height={1.5} fill={colors.gray500} /><SvgRect x={10} y={22} width={65} height={0.5} fill={colors.gray300} /><Section y={30} /><Section y={55} /></g></svg>;
            case 'matrix': return <svg {...svgWrapperProps}><SvgRect x={0} y={0} width={85} height={110} fill={colors.gray800} /><g transform="translate(8, 8)"><SvgRect x={0} y={0} width={40} height={4} fill={colors.green} /><SvgRect x={0} y={6} width={60} height={1.5} fill={colors.gray500} /><SvgRect x={0} y={20} width={0.75} height={80} fill={colors.green} /><Section y={20} x={5} width={65} headColor={colors.green} bodyColor={colors.gray700} /><Section y={45} x={5} width={65} headColor={colors.green} bodyColor={colors.gray700} /></g></svg>;
            case 'plum': return <svg {...svgWrapperProps}><g transform="translate(8, 10)"><SvgRect x={0} y={0} width={50} height={5} fill={colors.purple} /><SvgRect x={0} y={7} width={30} height={1.5} fill={colors.gray500} /><Section y={20} headColor={colors.purple} /><SvgRect x={8} y={40} width={69} height={0.5} fill={colors.gray200} /><Section y={45} headColor={colors.purple} /></g></svg>;
            
            // --- Two Column ---
            case 'creative': return <svg {...svgWrapperProps}><SvgRect x={0} y={0} width={28} height={110} fill={colors.gray700} /><g transform="translate(5, 15)"><SvgRect x={0} y={0} width={18} height={3} fill={colors.paper} /><TextBlock x={0} y={6} width={18} lines={3} fill={colors.gray500} /></g><g transform="translate(33, 10)"><Section y={0} width={47} /><Section y={25} width={47} /><Section y={50} width={47} /></g></svg>;
            case 'onyx': return <svg {...svgWrapperProps}><SvgRect x={0} y={0} width={28} height={110} fill={colors.gray800} /><SvgCircle cx={14} cy={15} r={8} fill={colors.primary} /><g transform="translate(0, 28)"><SvgRect x={4} y={0} width={20} height={3} fill={colors.paper} /><SidebarSection y={10} headColor={colors.primary} bodyColor={colors.gray500} /><SidebarSection y={25} headColor={colors.primary} bodyColor={colors.primary} /></g><g transform="translate(33, 10)"><Section y={0} width={47} /><Section y={25} width={47} /><Section y={50} width={47} /></g></svg>;
            case 'corporate': return <svg {...svgWrapperProps}><SvgRect x={0} y={0} width={28} height={110} fill={colors.gray50} /><SvgCircle cx={14} cy={15} r={8} fill={colors.gray300} /><g transform="translate(0, 28)"><SvgRect x={4} y={0} width={20} height={3} fill={colors.gray700} /><SidebarSection y={10} /><SidebarSection y={25} /><SidebarSection y={40} /></g><g transform="translate(33, 10)"><Section y={0} width={47} /><Section y={25} width={47} /><Section y={50} width={47} /></g></svg>;
            case 'galaxy': return <svg {...svgWrapperProps}><SvgRect x={0} y={0} width={28} height={110} fill={colors.gray50} /><SvgCircle cx={14} cy={15} r={8} fill={colors.primary} /><g transform="translate(0, 28)"><SvgRect x={4} y={0} width={20} height={3} fill={colors.primary} /><SidebarSection y={10} /><SidebarSection y={25} /></g><g transform="translate(33, 10)"><Section y={0} width={47} /><Section y={25} width={47} /><Section y={50} width={47} /></g></svg>;
            case 'infographic': return <svg {...svgWrapperProps}><SvgRect x={0} y={0} width={28} height={110} fill={colors.primary} /><SvgCircle cx={14} cy={15} r={8} fill={colors.paper} /><g transform="translate(0, 28)"><SvgRect x={4} y={0} width={20} height={3} fill={colors.paper} /><SidebarSection y={10} headColor={colors.paper} bodyColor={colors.paper} /><SidebarSection y={25} headColor={colors.paper} bodyColor={colors.paper} /></g><g transform="translate(33, 10)"><Section y={0} width={47} headColor={colors.primary} /><Section y={25} width={47} headColor={colors.primary} /><Section y={50} width={47} headColor={colors.primary} /></g></svg>;
            case 'executive': return <svg {...svgWrapperProps}><SvgRect x={0} y={0} width={28} height={110} fill={colors.paper} /><SvgRect x={28} y={0} width={0.75} height={110} fill={colors.gray800} /><g transform="translate(5, 10)"><SvgRect x={0} y={0} width={18} height={5} fill={colors.gray800} /><SidebarSection y={15} /><SidebarSection y={30} /></g><g transform="translate(33, 10)"><Section y={0} width={47} /><Section y={25} width={47} /><Section y={50} width={47} /></g></svg>;
            case 'spearmint': return <svg {...svgWrapperProps}><SvgRect x={0} y={0} width={28} height={110} fill={colors.emerald} fillOpacity={0.1} /><SvgCircle cx={14} cy={15} r={8} fill={colors.emerald} fillOpacity={0.3} /><g transform="translate(0, 28)"><SvgRect x={4} y={0} width={20} height={3} fill={colors.gray700} /><SidebarSection y={10} /><SidebarSection y={25} /><SidebarSection y={40} /></g><g transform="translate(33, 10)"><Section y={0} width={47} /><Section y={25} width={47} /><Section y={50} width={47} /></g></svg>;
            case 'blueprint': return <svg {...svgWrapperProps}><SvgRect x={28} y={0} width={57} height={110} fill={colors.gray50} /><SvgRect x={0} y={0} width={28} height={110} fill={colors.paper} /><SvgRect x={27} y={0} width={0.5} height={110} fill={colors.gray200} /><g transform="translate(5, 10)"><SvgRect x={0} y={0} width={18} height={3} fill={colors.blue} /><SvgRect x={0} y={4} width={18} height={0.5} fill={colors.blue} /><SidebarSection y={15} /><SidebarSection y={30} /></g><g transform="translate(33, 10)"><Section y={0} width={47} /><Section y={25} width={47} /><Section y={50} width={47} /></g></svg>;
            default: return null;
        }
    }
    return <div className="w-full h-full bg-white">{renderTemplate()}</div>;
};

export default TemplateThumbnail;
    