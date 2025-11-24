import { useEffect } from 'react';

interface ShortcutMap {
    [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if typing in an input
            if (
                document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA' ||
                document.activeElement?.isContentEditable
            ) {
                return;
            }

            const key = event.key.toLowerCase();
            const ctrl = event.ctrlKey || event.metaKey;

            // Construct key string like 'ctrl+k' or 'enter'
            const combo = [
                ctrl ? 'ctrl' : '',
                event.shiftKey ? 'shift' : '',
                event.altKey ? 'alt' : '',
                key
            ].filter(Boolean).join('+');

            if (shortcuts[combo]) {
                event.preventDefault();
                shortcuts[combo]();
            } else if (shortcuts[key]) { // Fallback to simple key
                event.preventDefault();
                shortcuts[key]();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
}
