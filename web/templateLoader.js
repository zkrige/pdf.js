class TemplateLoader {
    /**
     *
     * @param template {src, targetElementId}
     */
    loadTemplate(template) {
        const promise = new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', template.src, true);
            xhr.onreadystatechange = function() {
                if (this.readyState!==4) {
                    return;
                }
                if (this.status !== 200) {
                    reject(this)
                    return;
                }
                document.getElementById(template.targetElementId).outerHTML = this.responseText;
                resolve()
            };
            xhr.send();
        })
        return promise
    }
    
    /**
     *
     * @param css - css file to load
     */
    loadCss(css) {
        return new Promise((resolve, reject) => {
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.onload = function() {
                resolve();
            };
            link.href = css;
        
            let headScript = document.querySelector('script');
            headScript.parentNode.insertBefore(link, headScript);
        });
    }
    
    /**
     *
     * @param templates array of {src, css, targetElementId}
     */
    loadTemplates(templates) {
        let promises = []
        templates.forEach((template) => {
            const htmlPromise = this.loadTemplate(template)
            promises.push(htmlPromise)
            if (!!template.css) {
                const cssPromise = this.loadCss(template.css)
                promises.push(cssPromise)
            }
        })
        Promise.all(promises).then(() => {
            //load the viewer.js script AFTER all the template have been injected
            const script = document.createElement('script');
            script.src = "viewer.js";
            document.body.appendChild(script);
        })
    }
}

export default new TemplateLoader()
