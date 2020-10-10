import colors from 'vuetify/lib/util/colors'

const {red, green, blue} = colors;

export const button = {
    data: () => ({
        buttonColors: {
            green: [green.lighten1, green.darken1],
            red: [red.lighten1, red.darken1],
            blue: [blue.lighten1, blue.darken1],
        }
    }),
    methods: {
        buttonStyle({color}) {
            return `background:linear-gradient(to right, ${color[0]} 0%, ${color[1]} 100%)`
        }
    }
};
