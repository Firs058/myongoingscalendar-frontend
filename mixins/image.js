export const image = {
    methods: {
        getImagePath({paths, type}) {
            const noImage = paths.filter(e => e.mimeType === 'SVG');
            paths = !!noImage.length ? noImage : this.webpIsSupported ? paths.filter(e => e.mimeType === 'WEBP') : paths.filter(e => e.mimeType === 'JPG');
            return !!paths.length ? paths.find(i => i.imageType === type).path : '/images/noimage.svg'
        }
    },
    computed: {
        webpIsSupported: {
            get() {
                return this.$store.getters.webpIsSupported
            }
        }
    }
};
