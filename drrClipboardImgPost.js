document.querySelector('textarea').addEventListener('paste', e => {
    for (item of (e.clipboardData || e.originalEvent.clipboardData).items) {
        if (item.type.indexOf('image') !== -1) {
			event.preventDefault();
            const fd = new FormData();
            fd.append('img_path', item.getAsFile());
            fd.append('upimg', 'アップロード');
            fetch('/room/', {
                method: 'POST',
                body: fd
            });
        }
    }
});
