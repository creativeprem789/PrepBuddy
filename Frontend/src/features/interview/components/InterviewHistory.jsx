import React from 'react';
import { useInterview } from '../hooks/useInterview';
import { useNavigate } from 'react-router';

const InterviewHistory = () => {
    const { reports, loading } = useInterview();
    const navigate = useNavigate();

    if (loading && reports.length === 0) {
        return (
            <div className="pb-history-loading">
                <div className="doc-loader"></div>
                <p className="loading-text">Loading your history<span>.</span><span>.</span><span>.</span></p>
            </div>
        );
    }

    if (reports.length === 0) {
        return null; // Don't show anything if no history
    }

    return (
        <section className="pb-history-section">
            <div className="pb-section-header">
                <h3>Your Interview History</h3>
                <p>Review and improve from your past preparations</p>
            </div>
            <div className="pb-history-grid">
                {reports.map((report) => (
                    <div 
                        key={report._id} 
                        className="pb-history-card"
                        onClick={() => navigate(`/interview/${report._id}`)}
                    >
                        <div className="card-top">
                            <span className="date-tag">
                                {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <div className="score-badge">
                                {report.matchScore}% <span>Match</span>
                            </div>
                        </div>
                        <h4 className="job-title">{report.jobDescription.substring(0, 60)}...</h4>
                        <div className="card-footer">
                            <span className="view-link">View Detailed Plan →</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InterviewHistory;
