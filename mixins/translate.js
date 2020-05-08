export const translate = {
    methods: {
        translateGenre (genre) {
            return this.$t(`genres.${genre.id}`).includes('genres') ? genre.name : this.$t(`genres.${genre.id}`)
        }
    }
};
