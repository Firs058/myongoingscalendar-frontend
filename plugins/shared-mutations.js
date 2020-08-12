import shareMutations from 'vuex-shared-mutations'

export default ({store}) => {
    shareMutations({
        predicate: ['SET_USER', 'SET_TOKENS', 'SET_SETTINGS']
    })(store)
}
