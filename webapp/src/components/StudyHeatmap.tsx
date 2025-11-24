import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';

interface StudyHeatmapProps {
    data: { date: string; count: number }[];
}

export function StudyHeatmap({ data }: StudyHeatmapProps) {
    const today = new Date();

    // Transform data for heatmap
    // Filter for last 90 days to match display
    const heatmapData = data.map(d => ({
        date: d.date,
        count: d.count > 0 ? Math.min(d.count, 4) : 0 // Cap at 4 for color scale
    }));

    return (
        <div className="heatmap-container">
            <CalendarHeatmap
                startDate={subDays(today, 90)}
                endDate={today}
                values={heatmapData}
                classForValue={(value) => {
                    if (!value || value.count === 0) {
                        return 'color-empty';
                    }
                    return `color-scale-${value.count}`;
                }}
                tooltipDataAttrs={(value: { date: string; count: number } | null) => {
                    return {
                        'data-tip': value && value.date ? `${value.date}: ${value.count} words` : 'No activity',
                    };
                }}
                showWeekdayLabels={true}
            />
            <style>{`
                .heatmap-container text {
                    font-size: 10px;
                    fill: #9CA3AF;
                }
                .react-calendar-heatmap .color-empty { fill: #F3F4F6; }
                .react-calendar-heatmap .color-scale-1 { fill: #C7D2FE; } // 1-5 words
                .react-calendar-heatmap .color-scale-2 { fill: #818CF8; } // 6-10 words
                .react-calendar-heatmap .color-scale-3 { fill: #4F46E5; } // 11-15 words
                .react-calendar-heatmap .color-scale-4 { fill: #3730A3; } // 16+ words
                .react-calendar-heatmap rect { rx: 2px; }
            `}</style>
        </div>
    );
}
