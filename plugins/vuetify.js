import Vue from 'vue'
import Vuetify, {
    VCard,
    VNavigationDrawer,
    VFooter,
    VList,
    VListTile,
    VListTileAction,
    VListTileContent,
    VListTileTitle,
    VBtn,
    VIcon,
    VToolbar,
    VSnackbar,
    VDivider,
    VAvatar,
    VMenu,
    VSubheader,
    VChip,
    VTextField,
    VAlert,
    VDialog,
    VCheckbox,
    VTooltip,
    VForm,
    VTabs,
    VTab,
    VImg,
    VProgressCircular,
    VSelect,
    VSwitch,
    VAutocomplete,
    VDataTable,
    VTextarea,
    VExpansionPanel,
    VPagination
} from 'vuetify/lib'

Vue.use(Vuetify, {
    components: {
        VCard,
        VNavigationDrawer,
        VFooter,
        VList,
        VListTile,
        VListTileAction,
        VListTileContent,
        VListTileTitle,
        VBtn,
        VIcon,
        VToolbar,
        VSnackbar,
        VDivider,
        VAvatar,
        VMenu,
        VSubheader,
        VChip,
        VTextField,
        VAlert,
        VDialog,
        VCheckbox,
        VTooltip,
        VForm,
        VTabs,
        VTab,
        VImg,
        VProgressCircular,
        VSelect,
        VSwitch,
        VAutocomplete,
        VDataTable,
        VTextarea,
        VExpansionPanel,
        VPagination
    },
    options: {
        minifyTheme: function (css) {
            return process.env.NODE_ENV === 'production'
                ? css.replace(/[\s|\r\n|\r|\n]/g, '')
                : css
        }
    }
});
