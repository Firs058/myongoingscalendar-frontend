<script>
    import {Line} from 'vue-chartjs'
    import {mapGetters} from 'vuex'

    export default {
        extends: Line,
        props: ['chartData'],
        computed: {
            ...mapGetters([
                'dark'
            ]),
            chartOptions() {
                const mainColor = this.dark ? 'white' : 'black';
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
                    title: {
                        display: true,
                        fontSize: 16,
                        text: this.$t("title.chart.title_text"),
                        fontFamily: fontFamily,
                        fontColor: mainColor
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
                                color: this.dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontFamily: fontFamily,
                                fontColor: mainColor,
                                fontSize: 14,
                                stepSize: 1
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    }
                }
            }
        },
        mounted() {
            this.renderChart(this.chartData, this.chartOptions)
        }
    }
</script>
