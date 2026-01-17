import { useState, useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { getVersion } from '@tauri-apps/api/app';
import { RefreshCw, Download, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Settings() {
    const [appVersion, setAppVersion] = useState('v1.0.0');
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'uptodate' | 'error'>('idle');
    const [updateMsg, setUpdateMsg] = useState('');
    const [updateObj, setUpdateObj] = useState<any>(null);

    useEffect(() => {
        getVersion().then(v => setAppVersion(`v${v}`)).catch(e => console.error(e));
    }, []);

    const checkForUpdates = async () => {
        setUpdateStatus('checking');
        setUpdateMsg('Checking for updates...');

        try {
            const update = await check();
            if (update) {
                console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`);
                setUpdateStatus('available');
                setUpdateMsg(`New version ${update.version} available!`);
                setUpdateObj(update);
            } else {
                setUpdateStatus('uptodate');
                setUpdateMsg('You are using the latest version.');
            }
        } catch (error: any) {
            console.error(error);
            setUpdateStatus('error');
            setUpdateMsg(`Error checking for updates: ${error.message || error}`);
        }
    };

    const installUpdate = async () => {
        if (!updateObj) return;

        setUpdateStatus('checking'); // Revert to spinner or similar "busy" state
        setUpdateMsg('Downloading and installing update...');

        try {
            let downloaded = 0;
            let contentLength = 0;

            await updateObj.downloadAndInstall((event: any) => {
                switch (event.event) {
                    case 'Started':
                        contentLength = event.data.contentLength;
                        console.log(`started downloading ${contentLength} bytes`);
                        break;
                    case 'Progress':
                        downloaded += event.data.chunkLength;
                        console.log(`downloaded ${downloaded} from ${contentLength}`);
                        break;
                    case 'Finished':
                        console.log('download finished');
                        break;
                }
            });

            setUpdateMsg('Update installed. Restart application to apply.');
            // Ideally show a "Restart" button here, but for now just message
            setUpdateStatus('uptodate'); // Or a "restart needed" state
        } catch (error: any) {
            console.error(error);
            setUpdateStatus('error');
            setUpdateMsg(`Update failed: ${error.message || error}`);
        }
    };

    return (
        <div className="fade-in">
            <h1>Settings</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Manage application preferences and updates.</p>

            <div className="card">
                <h2><ShieldCheck size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} /> Software Update</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="stat-label">Current Version</div>
                            <div className="stat-value" style={{ fontSize: 18 }}>{appVersion}</div>
                        </div>

                        {updateStatus === 'idle' && (
                            <button className="primary" onClick={checkForUpdates}>
                                <RefreshCw size={16} /> Check for Updates
                            </button>
                        )}

                        {updateStatus === 'checking' && (
                            <button disabled className="secondary">
                                <RefreshCw className="spin" size={16} /> Checking...
                            </button>
                        )}

                        {updateStatus === 'uptodate' && (
                            <button className="secondary" onClick={checkForUpdates}>
                                <CheckCircle size={16} /> Check Again
                            </button>
                        )}

                        {updateStatus === 'available' && (
                            <button className="primary" onClick={installUpdate}>
                                <Download size={16} /> Update Now
                            </button>
                        )}

                        {updateStatus === 'error' && (
                            <button className="danger" onClick={checkForUpdates}>
                                <AlertTriangle size={16} /> Retry
                            </button>
                        )}
                    </div>

                    {(updateStatus !== 'idle') && (
                        <div style={{
                            padding: 10,
                            background: updateStatus === 'error' ? 'rgba(255,59,48,0.1)' : 'var(--bg-secondary)',
                            borderRadius: 8,
                            fontSize: 13,
                            color: updateStatus === 'error' ? 'var(--accent-danger)' : 'var(--text-primary)'
                        }}>
                            {updateMsg}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
