<script>
    import Partitionmetric from "@/components/Metrics/PartitionMetric";
    import FilterBehavior from "./FilterBehavior";
    import { minimum } from "@/util";

    export default {
        extends: Partitionmetric,
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
                            value: { value },
                        },
                    }) => {
                        this.chartData = value;
                        this.loading = false;
                    }
                );
            },
        },
    };
</script>
