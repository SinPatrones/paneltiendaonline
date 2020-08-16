const path = require('path');

module.exports={
    entry:'./app/index.js',
    output:{
        path: path.join(__dirname, '../tiendaonline/src/public/javascript'),
        filename:'bundle.js'
    },

    module: {
        rules:[
            {
                use:'babel-loader',
                test:/\.js$/,
                exclude: /node_modules/,
                
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }

};