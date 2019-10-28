<script>
    import {Line} from 'vue-chartjs'
    import {mapGetters} from 'vuex'

    export default {
        extends: Line,
        props: ['chartData'],
        computed: {
            ...mapGetters([
                'settings'
            ]),
            chartOptions() {
                const mainColor = this.settings.dark ? 'white' : 'black';
                const fontFamily = "'Roboto', sans-serif";
                return {
                    responsive: true,
                    maintainAspectRatio: false,
                    spanGaps: true,
                    legend: {
                        position: 'top',
                        labels: {
                            fontFamily: fontFamily,
                            fontColor: mainColor,
                            fontSize: 16,
                            usePointStyle: true
                        }
                    },
                    ticks: {
                        fontFamily: fontFamily,
                        fontColor: mainColor
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontFamily: fontFamily,
                                fontColor: mainColor,
                                fontSize: 14,
                                stepSize: 1
                            },
                            gridLines: {
                                drawBorder: false,
                                color: this.settings.dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'
                            },
                            scaleLabel: {
                                display: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontFamily: fontFamily,
                                fontColor: mainColor,
                                fontSize: 14,
                                stepSize: 1,
                                maxTicksLimit: 10
                            },
                            gridLines: {
                                display: false
                            },
                            scaleLabel: {
                                display: true
                            }
                        }]
                    },
                    tooltips: {
                        titleFontFamily: fontFamily,
                        bodyFontFamily: fontFamily,
                        footerFontFamily: fontFamily,
                        backgroundColor: '#616161',
                        cornerRadius: 2,
                        caretSize: 0,
                        displayColors: false,
                        intersect: false,
                        mode: 'index'
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    }
                }
            }
        },
        mounted() {
            this.renderChart(this.chartData, this.chartOptions)
        }
    }
</script>
