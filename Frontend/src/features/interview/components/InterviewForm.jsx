import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';

const InterviewForm = () => {
    const navigate = useNavigate();
    const { generateReport, loading: contextLoading } = useInterview();
    const [jobDesc, setJobDesc] = useState('');
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null); // 'success', 'error'
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobDesc || !notes) {
            setStatus('error');
            return;
        }

        setStatus(null);
        
        try {
            const report = await generateReport({ 
                jobDescription: jobDesc, 
                selfDescription: notes, 
                resumeFile: file 
            });
            
            if (report) {
                setStatus('success');
                // Brief delay to show success state before navigating
                setTimeout(() => {
                    navigate(`/interview/${report._id}`);
                }, 1500);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            setStatus('error');
        }
    };

    return (
        <section className="pb-form-section">
            <div className="pb-container">
                <div className="pb-card">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="jobDescription">Job Description</label>
                            <p className="pb-helper">Paste the details about the role you're hiring for.</p>
                            <div className="pb-textarea-wrapper">
                                <textarea 
                                    id="jobDescription"
                                    value={jobDesc}
                                    onChange={(e) => setJobDesc(e.target.value)}
                                    placeholder="e.g. Senior Frontend Engineer with React experience..."
                                    maxLength={2000}
                                />
                                <span className="pb-char-count">{jobDesc.length}/2000</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="selfDescription">Your Self Description</label>
                            
                            <div className="pb-textarea-wrapper">
                                <textarea 
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="e.g. Discussed system design, noted strong communication skills..."
                                    maxLength={3000}
                                />
                                <span className="pb-char-count">{notes.length}/3000</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Resume (Optional)</label>
                            <div 
                                className={`pb-upload-area ${file ? 'has-file' : ''}`}
                                onClick={() => fileInputRef.current.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const droppedFile = e.dataTransfer.files[0];
                                    if(droppedFile) setFile(droppedFile);
                                }}
                            >
                                <div className="pb-upload-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                </div>
                                <p className="pb-upload-text">
                                    {file ? `File selected: ${file.name}` : "Upload resume or notes (Drag & Drop)"}
                                </p>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    hidden 
                                    accept=".pdf,.doc,.docx"
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="pb-alert pb-alert-error">
                                <p>Ops! Please fill in both the job description and notes first.</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="pb-alert pb-alert-success">
                                <p>Success! Your interview report is being created.</p>
                            </div>
                        )}

                        <div className="pb-form-footer">
                            <button 
                                type="submit" 
                                className={`pb-btn-primary ${contextLoading ? 'loading' : ''}`}
                                disabled={contextLoading}
                            >
                                {contextLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Generating...
                                    </>
                                ) : "Generate Report"}
                            </button>
                            <p className="pb-privacy-text">Don’t worry, your data stays private.</p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default InterviewForm;
