import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";

export default {
    input: "./src/main.ts",
    plugins: [
        typescript({
            include: 'src/**',
            typescript: require("typescript")
        }),
        sourceMaps()
    ],
    output: [
        {
            format: "umd",
            file: "dist/bundle.umd.js",
            name: 'spm',
            sourcemap: true
        }
    ]
};