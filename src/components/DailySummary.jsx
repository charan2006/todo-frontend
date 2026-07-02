import { useState } from 'react';
import { getDailySummary } from '../api';

const DailySummary = () => {
    const [summary, setSummary] = useState('');
    const [totalPending, setTotalPending] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleGetSummary = async () => {
        setLoading(true);
        setOpen(true);
        try {
            const res = await getDailySummary();
            setSummary(res.summary);
            setTotalPending(res.totalPending);
        } catch (err) {
            setSummary('Could not generate summary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button className="summary-btn" onClick={handleGetSummary}>
                📋 Daily Summary
            </button>

            {open && (
                <div className="summary-overlay" onClick={() => setOpen(false)}>
                    <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="summary-modal-header">
                            <span>📋 Daily Summary</span>
                            <button className="summary-modal-close" onClick={() => setOpen(false)}>✕</button>
                        </div>
                        <div className="summary-modal-body">
                            {loading ? (
                                <div className="summary-loading">
                                    <div className="summary-spinner" />
                                    <p>Generating your summary...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="summary-stat">
                                        {totalPending} pending task{totalPending !== 1 ? 's' : ''}
                                    </div>
                                    <p className="summary-text">{summary}</p>
                                    <button
                                        className="summary-refresh-btn"
                                        onClick={handleGetSummary}
                                    >
                                        🔄 Refresh
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DailySummary;