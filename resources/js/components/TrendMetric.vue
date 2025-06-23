<script>
    import TrendMetric from "@/components/Metrics/TrendMetric";
    import FilterBehavior from "./FilterBehavior";
    import { minimum } from "@/util";
    export default {
        extends: TrendMetric,
        mixins: [FilterBehavior],
        computed: {
            /**
             * Get the correct metric endpoint based on context
             */
            correctMetricEndpoint() {
                // If we're on a dashboard, use the dashboard metric endpoint
                if (this.$route && this.$route.name === 'nova-dashboard') {
                    return `/nova-api/dashboards/cards/${this.$route.params.dashboard}/metrics/${this.uriKey}`;
                }
                
                // Otherwise use the default metric endpoint
                return this.metricEndpoint;
            }
        },
        methods: {
            fetch() {
                this.loading = true;

                minimum(
                    Nova.request().get(
                        this.correctMetricEndpoint,
                        this.filterPayload()
                    )
                ).then(
                    ({
                        data: {
                            value: {
                                labels,
                                trend,
                                value,
                                prefix,
                                suffix,
                                suffixInflection,
                                format,
                            },
                        },
                    }) => {
                        this.value = value;
                        this.labels = Object.keys(trend);
                        this.data = {
                            labels: Object.keys(trend),
                            series: [
                                _.map(trend, (value, label) => {
                                    return {
                                        meta: label,
                                        value: value,
                                    };
                                }),
                            ],
                        };
                        this.format = format || this.format;
                        this.prefix = prefix || this.prefix;
                        this.suffix = suffix || this.suffix;
                        this.suffixInflection = suffixInflection;
                        this.loading = false;
                    }
                );
            },
        },
    };
</script>
