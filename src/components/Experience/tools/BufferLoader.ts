export class BufferLoader {

    private context: any;
    private urlList: any;
    private onload: any;
    private bufferList: any;
    private loadCount: number;

    constructor (context: any, urlList: any, callback: any) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
    }

    public loadBuffer (url: string, index: any) {
        // Load buffer asynchronously
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
    
        const loader = this;
    
        request.onload = () => {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(request.response, (buffer: any) => {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount === loader.urlList.length) {
                        loader.onload(loader.bufferList);
                    }
                }
            );
        }
    
        request.onerror = () => {
            alert('BufferLoader: XHR error');
        }
    
        request.send();
    }

    public load() {
        for (let i = 0; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
        }
    }

}