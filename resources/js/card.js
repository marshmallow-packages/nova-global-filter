Nova.booting((app, router, store) => {
    app.component(
        "partition-metric",
        require("./components/PartitionMetric").default
    );
    app.component("trend-metric", require("./components/TrendMetric").default);
    app.component("value-metric", require("./components/ValueMetric").default);
    app.component(
        "progress-metric",
        require("./components/ProgressMetric").default
    );
    app.component(
        "nova-global-filter",
        require("./components/GlobalFilter").default
    );
});
