
        // Function to parse markdown-like text
        function parseMarkdown(text) {
            let html = text;
            
            // Parse ## headings
            html = html.replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>');
            
            // Parse * headings as h3
            html = html.replace(/^\* \*\*(.*?)\*\*:?/gm, '<h3>$1</h3>');
            
            // Parse bullet points
            html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
            
            // Wrap consecutive <li> tags in <ul>
            html = html.replace(/(<li>.*?<\/li>\s*)+/gs, '<ul>$&</ul>');
            
            // Parse bold text
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Parse italic text
            html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
            
            // Clean up extra newlines
            html = html.replace(/\n\n+/g, '</p><p>');
            html = '<p>' + html + '</p>';
            html = html.replace(/<p><\/p>/g, '');
            html = html.replace(/<p>(<h[23]>)/g, '$1');
            html = html.replace(/(<\/h[23]>)<\/p>/g, '$1');
            html = html.replace(/<p>(<ul>)/g, '$1');
            html = html.replace(/(<\/ul>)<\/p>/g, '$1');
            html = html.replace(/<p>\s*<\/p>/g, '');
            
            return html;
        }

        // Load saved notes on startup
        document.addEventListener('DOMContentLoaded', () => {
            chrome.storage.local.get(['researchNotes'], function(result) {
                if (result.researchNotes) {
                    document.getElementById('notes').value = result.researchNotes;
                } 
            });

            document.getElementById('suggestBtn').addEventListener('click', suggestText);
            document.getElementById('summarizeBtn').addEventListener('click', summarizeText);
            document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
        });

        // Summarize selected text
        async function summarizeText() {
            const btn = document.getElementById('summarizeBtn');
            const originalHTML = btn.innerHTML;
            
            try {
                btn.disabled = true;
                btn.innerHTML = '<div class="loading"></div>Processing...';
                
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: () => window.getSelection().toString()
                });

                if (!result) {
                    showResult('<div class="error-message"> Please select some text first</div>');
                    return;
                }

                const response = await fetch('http://localhost:8080/api/research/process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: result, operation: 'summarize' })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const text = await response.text();
                showResult(parseMarkdown(text));

            } catch (error) {
                showResult(`<div class="error-message"> Error: ${error.message}</div>`);
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        }

        // Suggest related topics
        async function suggestText() {
            const btn = document.getElementById('suggestBtn');
            const originalHTML = btn.innerHTML;
            
            try {
                btn.disabled = true;
                btn.innerHTML = '<div class="loading"></div>Processing...';
                
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: () => window.getSelection().toString()
                });

                if (!result) {
                    showResult('<div class="error-message"> Please select some text first</div>');
                    return;
                }

                const response = await fetch('http://localhost:8080/api/research/process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: result, operation: 'suggest' })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const text = await response.text();
                showResult(parseMarkdown(text));

            } catch (error) {
                showResult(`<div class="error-message"> Error: ${error.message}</div>`);
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        }

        // Save notes to Chrome storage
        async function saveNotes() {
            const notes = document.getElementById('notes').value;
            const btn = document.getElementById('saveNotesBtn');
            const originalHTML = btn.innerHTML;
            
            if (!notes.trim()) {
                return;
            }
            
            chrome.storage.local.set({ 'researchNotes': notes }, function() {
                btn.innerHTML = '<span class="icon">✓</span>Saved!';
                btn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                }, 2000);
            });
        }

        // Display results
        function showResult(content) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `<div class="result-item"><div class="result-content">${content}</div></div>`;
        }