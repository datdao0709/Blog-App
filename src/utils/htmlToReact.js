import React from 'react';

export function htmlToReact(html) {
    if (!html) return null;
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
        return html.replace(/<[^>]+>/g, '').split('\n').map((t, i) => <p key={i}>{t}</p>);
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const allowedTags = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'blockquote', 'code', 'pre']);
    const allowedAttrs = new Set(['href', 'target', 'rel', 'title']);

    const mapNode = (node, key) => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent;
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            const children = Array.from(node.childNodes).map((n, i) => mapNode(n, `${key}-${i}`)).filter(Boolean);
            if (!allowedTags.has(tag)) return children.length === 1 ? children[0] : children;
            const props = {key};
            if (tag === 'a') {
                const href = node.getAttribute('href');
                if (href) props.href = href;
                props.target = node.getAttribute('target') || '_blank';
                props.rel = node.getAttribute('rel') || 'noopener noreferrer';
            } else Array.from(node.attributes || []).forEach(attr => allowedAttrs.has(attr.name) && (props[attr.name] = attr.value));
            return tag === 'br' ? React.createElement('br', props) : React.createElement(tag, props, children.length ? children : null);
        }
        return null;
    };

    return Array.from(doc.body.childNodes).map((n, i) => mapNode(n, `root-${i}`)).filter(Boolean);
}