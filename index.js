document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Update URL without refreshing
            history.pushState(null, null, targetId);
        });
    });
    
    // Highlight current section in navigation
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('nav a');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initialize on load
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // Remove all highlights if search is empty
            document.querySelectorAll('.highlight').forEach(el => {
                el.outerHTML = el.innerHTML;
            });
            return;
        }
        
        // First remove any existing highlights
        document.querySelectorAll('.highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        // Search through all text content in main
        const mainContent = document.querySelector('main');
        const textNodes = [];
        
        const walker = document.createTreeWalker(
            mainContent,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.trim() !== '') {
                textNodes.push(node);
            }
        }
        
        textNodes.forEach(textNode => {
            const content = textNode.nodeValue;
            const parent = textNode.parentNode;
            
            if (content.toLowerCase().includes(searchTerm) && 
                parent.nodeName !== 'SCRIPT' && 
                parent.nodeName !== 'STYLE' &&
                !parent.classList.contains('no-search')) {
                
                const regex = new RegExp(searchTerm, 'gi');
                const newContent = content.replace(regex, match => 
                    `<span class="highlight">${match}</span>`
                );
                
                const newElement = document.createElement('span');
                newElement.innerHTML = newContent;
                parent.replaceChild(newElement, textNode);
            }
        });
        
        // Scroll to first highlight if found
        const firstHighlight = document.querySelector('.highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Back to top button
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Copy code blocks functionality
    document.querySelectorAll('code').forEach(codeBlock => {
        codeBlock.addEventListener('click', function() {
            const range = document.createRange();
            range.selectNode(this);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            
            try {
                document.execCommand('copy');
                const originalText = this.textContent;
                this.textContent = 'Đã sao chép!';
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1000);
            } catch(err) {
                console.error('Không thể sao chép: ', err);
            }
            
            window.getSelection().removeAllRanges();
        });
    });
});