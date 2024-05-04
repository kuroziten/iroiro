const textarea = document.querySelector('textarea');

textarea.addEventListener('paste', e => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Data = e.target.result;
                const fd = new FormData();
                fd.append('img_path', base64Data);
                fd.append('upimg', 'アップロード');
                fetch('/room/', {
                    method: 'POST',
                    body: fd
                })
            };
            reader.readAsDataURL(blob);
        }
    }
});
