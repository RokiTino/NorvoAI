import React, { useState } from 'react';
import { FileText, Download, Copy, Check, Sparkles, Search, Calendar, User, Home, Zap, ExternalLink, BookOpen, BarChart3, Users, Activity, Settings, LogOut } from 'lucide-react';
import { useGenerateDocument } from '../hooks/useEdgeFunctions';
import { supabase } from '../services/supabase';

const Documentation = ({ session, onNavigate, onSignOut }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [workspaceId, setWorkspaceId] = useState(null);

  useEffect(() => {
    const loadWorkspace = async () => {
      if (session?.user) {
        // Get the workspace ID from the database
        const { data } = await supabase
          .from('workspaces')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        if (data) {
          setWorkspaceId(data.id);
        } else {
          // Create workspace if it doesn't exist
          const { data: newWorkspace } = await supabase
            .from('workspaces')
            .insert({
              user_id: session.user.id,
              name: 'My Workspace',
              settings: {}
            })
            .select('id')
            .single();
          
          if (newWorkspace) {
            setWorkspaceId(newWorkspace.id);
          }
        }
      }
    };
    
    loadWorkspace();
  }, [session]);

  const generateDoc = useGenerateDocument();

  const handleGenerate = async () => {
    if (!workspaceId) {
      alert('Please wait, loading workspace...');
      return;
    }
  
    try {
      const result = await generateDoc.mutateAsync({
        type: generatorData.type,
        input: generatorData.input,
        workspaceId: workspaceId,
        tone: generatorData.tone || 'professional',
        length: generatorData.length || 'detailed',
      });
  
      console.log('Generated document:', result);
      alert(`Document "${result.document.title}" created successfully!`);
      setShowGenerator(false);
      
      // Reload documents list
      loadDocuments();
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document: ' + error.message);
    }
  };

  const loadDocuments = async () => {
    if (!workspaceId) return;
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    if (data) {
      // Transform the data to match your UI format
      const transformedDocs = data.map(doc => ({
        id: doc.id,
        title: doc.title,
        type: doc.type,
        created: new Date(doc.created_at).toLocaleDateString(),
        author: 'AI Generator',
        status: doc.status === 'draft' ? 'Draft' : 'Published',
        preview: doc.content.substring(0, 150) + '...',
      }));
      
      setDocuments(transformedDocs);
    }
  };
  
  // Call this in useEffect
  useEffect(() => {
    loadDocuments();
  }, [workspaceId]);
  
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeColor = (type) => docTypes.find(t => t.value === type)?.color || '#2D3748';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)' }}>
      <aside style={{ width: '240px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #1E90FF, #7B2CBF)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '18px' }}>N</div>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>Norvo<span style={{ color: '#FF6B35' }}>.AI</span></span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button key={item.value} onClick={() => onNavigate(item.value)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: item.active ? 'rgba(30,144,255,0.15)' : 'transparent', border: 'none', borderLeft: item.active ? '3px solid #1E90FF' : '3px solid transparent', color: item.active ? '#1E90FF' : 'rgba(255,255,255,0.7)', borderRadius: '0 6px 6px 0', cursor: 'pointer', fontWeight: item.active ? '600' : '400', fontSize: '0.875rem', transition: 'all 0.2s', textAlign: 'left', marginBottom: '0.25rem' }}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={onSignOut} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>AI Documentation</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>Generate PRDs, technical specs, and summaries with AI</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowGenerator(true)} style={{ background: 'linear-gradient(135deg, #1E90FF, #7B2CBF)', border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <Sparkles size={20} />
              Generate New Document
            </button>
            <div style={{ flex: 1, display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.5rem' }}>
                <Search size={18} color="rgba(255,255,255,0.5)" />
                <input type="text" placeholder="Search documents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, background: 'none', border: 'none', color: 'white', outline: 'none', padding: '0.75rem 0', fontSize: '0.95rem' }} />
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', padding: '0 1rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                <option value="all">All Types</option>
                {docTypes.map(type => <option key={type.value} value={type.value}>{type.icon} {type.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {filteredDocs.map(doc => (
              <div key={doc.id} onClick={() => setSelectedDoc(doc)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: getTypeColor(doc.type) }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ background: `${getTypeColor(doc.type)}20`, color: getTypeColor(doc.type), padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                    {docTypes.find(t => t.value === doc.type)?.icon} {docTypes.find(t => t.value === doc.type)?.label}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: doc.status === 'Published' ? '#48BB78' : '#F6AD55', background: doc.status === 'Published' ? 'rgba(72,187,120,0.1)' : 'rgba(246,173,85,0.1)', padding: '0.25rem 0.75rem', borderRadius: '6px' }}>{doc.status}</span>
                </div>
                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{doc.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.5' }}>{doc.preview}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {doc.created}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={12} />
                    {doc.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showGenerator && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }} onClick={() => setShowGenerator(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>AI Document Generator</h2>
              <button onClick={() => setShowGenerator(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>What would you like to create?</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {docTypes.map(type => (
                  <button key={type.value} onClick={() => setGeneratorData({ ...generatorData, type: type.value })} style={{ background: generatorData.type === type.value ? `${type.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${generatorData.type === type.value ? type.color : 'rgba(255,255,255,0.1)'}`, color: generatorData.type === type.value ? type.color : 'white', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>Paste your notes, ideas, or Jira tickets:</label>
              <textarea value={generatorData.input} onChange={(e) => setGeneratorData({ ...generatorData, input: e.target.value })} placeholder="We need to build..." style={{ width: '100%', minHeight: '150px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', padding: '1rem', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowGenerator(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              <button onClick={() => { alert('Generating...'); setShowGenerator(false); }} disabled={!generatorData.input} style={{ background: generatorData.input ? 'linear-gradient(135deg, #1E90FF, #7B2CBF)' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: generatorData.input ? 'pointer' : 'not-allowed', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: generatorData.input ? 1 : 0.5 }}>
                <Sparkles size={18} />
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }} onClick={() => setSelectedDoc(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ background: `${getTypeColor(selectedDoc.type)}20`, color: getTypeColor(selectedDoc.type), padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>{docTypes.find(t => t.value === selectedDoc.type)?.icon} {docTypes.find(t => t.value === selectedDoc.type)?.label}</div>
                  <span style={{ fontSize: '0.75rem', color: selectedDoc.status === 'Published' ? '#48BB78' : '#F6AD55', background: selectedDoc.status === 'Published' ? 'rgba(72,187,120,0.1)' : 'rgba(246,173,85,0.1)', padding: '0.25rem 0.75rem', borderRadius: '6px' }}>{selectedDoc.status}</span>
                </div>
                <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>{selectedDoc.title}</h2>
              </div>
              <button onClick={() => setSelectedDoc(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
              <p>{selectedDoc.preview}</p>
              <p style={{ marginTop: '1rem' }}>[Full document content would be displayed here...]</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {selectedDoc.notionUrl && <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><FileText size={18} />Open in Notion</button>}
              <button onClick={() => handleCopy(selectedDoc.preview)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button style={{ flex: 1, background: 'linear-gradient(135deg, #1E90FF, #7B2CBF)', border: 'none', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Download size={18} />Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentation;