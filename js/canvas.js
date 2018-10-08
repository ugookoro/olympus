class ImageCanvas {
    constructor(canvasId) {

        if (fabric == null) {
            alert('Please Make Sure Fabric Js is included');
        } else {
            var myfont = new FontFaceObserver('Fira Sans');
            myfont.load()
                .then(function () {
                    this.Canvas = new fabric.Canvas(canvasId);
                    this.Canvas.preserveObjectStacking = true;
                    this.Angle = 0;
                    this.CurrentScale = 1;
                    this.VintageApplied = false;
                    this.BrownieApplied = false;
                }.bind(this)).catch(function (e) {
                    console.log(e);
                    alert('font loading failed ' + e);
                });


        }

    }

    upload() {

        this.Canvas.clear();
        var fileInput = document.createElement("input");
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("style", "display:none");
        fileInput.addEventListener(
            "change",
            function (event) {
                for (var i = 0; i < fileInput.files.length; i++) {
                    var boundRender = this.render.bind(this, fileInput.files[i], this.Canvas); // change definition or context of this with bind function
                    //this.render(fileInput.files[i], i, this.fileList);
                    boundRender();
                }
                //document.body.appendChild(fileInput);
            }.bind(this)
        );
        fileInput.click();
    }


    zoomIn() {

        var scale = this.CurrentScale + 0.1;
        var image = this.Canvas.getObjects('image')[0];
        image.scale(scale);
        this.CurrentScale = scale;
        this.Canvas.renderAll();
    }

    zoomOut() {
        var scale = this.CurrentScale - 0.1;
        var image = this.Canvas.getObjects('image')[0];
        image.scale(scale);
        this.CurrentScale = scale;
        this.Canvas.renderAll();
    }

    rotate() {
        var image = this.Canvas.getObjects('image')[0];
        image.rotate(this.Angle + 90);
        this.Angle += 90;
        this.Canvas.renderAll();

    }

    save(){
        var dataURL = this.Canvas.toDataURL({
            format: 'png',
            quality: 1
          });

          var image = document.getElementById('final');
          image.setAttribute('src', dataURL);
    }

    applyFilter(filterName) {
        var img = this.Canvas.getObjects('image')[0];
        switch (filterName) {
            case 'grayscale':
                if (img.filters.find((x) => {
                        return x.type === 'Grayscale';
                    }) === null || img.filters.find((x) => {
                        return x.type === 'Grayscale';
                    }) === undefined) {
                    img.filters.push(new fabric.Image.filters.Grayscale());
                } else {
                    let filter = img.filters.find(x => x.type === 'Grayscale');
                    img.filters.splice(img.filters.indexOf(filter), 1);
                }
                break;

            case 'sepia':
                if (img.filters.find((x) => {
                        return x.type === 'Sepia';
                    }) === null || img.filters.find((x) => {
                        return x.type === 'Sepia';
                    }) === undefined) {
                    img.filters.push(new fabric.Image.filters.Sepia());
                } else {
                    let filter = img.filters.find((x) => {
                        return x.type === 'Sepia';
                    });
                    img.filters.splice(img.filters.indexOf(filter), 1);
                }
                break;

            case 'pixelate':
                if (img.filters.find((x) => {
                        return x.type === 'Pixelate';
                    }) === null || img.filters.find((x) => {
                        return x.type === 'Pixelate';
                    }) === undefined) {
                    img.filters.push(new fabric.Image.filters.Pixelate());
                } else {
                    let filter = img.filters.find((x) => {
                        return x.type === 'Pixelate';
                    });
                    img.filters.splice(img.filters.indexOf(filter), 1);
                }
                break;

            case 'brownie':
                if (!this.BrownieApplied) {
                    img.filters.push(new fabric.Image.filters.ColorMatrix({
                        matrix: [
                            0.59970, 0.34553, -0.27082, 0, 0.186,
                            -0.03770, 0.86095, 0.15059, 0, -0.1449,
                            0.24113, -0.07441, 0.44972, 0, -0.02965,
                            0, 0, 0, 1, 0
                        ]
                    }));
                    this.BrownieApplied = true;
                } else {
                    let filter = img.filters.find((x) => {
                        return x.matrix === [
                            0.59970, 0.34553, -0.27082, 0, 0.186,
                            -0.03770, 0.86095, 0.15059, 0, -0.1449,
                            0.24113, -0.07441, 0.44972, 0, -0.02965,
                            0, 0, 0, 1, 0
                        ];
                    });
                    img.filters.splice(img.filters.indexOf(filter), 1);
                    this.BrownieApplied = false;
                }
                break;
            case 'vintage':
                if (!this.VintageApplied) {
                    img.filters.push(new fabric.Image.filters.ColorMatrix({
                        matrix: [
                            0.62793, 0.32021, -0.03965, 0, 0.03784,
                            0.02578, 0.64411, 0.03259, 0, 0.02926,
                            0.04660, -0.08512, 0.52416, 0, 0.02023,
                            0, 0, 0, 1, 0
                        ]
                    }));

                    this.VintageApplied = true;
                } else {
                    let filter = img.filters.find((x) => {
                        return x.matrix === [
                            0.62793, 0.32021, -0.03965, 0, 0.03784,
                            0.02578, 0.64411, 0.03259, 0, 0.02926,
                            0.04660, -0.08512, 0.52416, 0, 0.02023,
                            0, 0, 0, 1, 0
                        ];
                    });
                    img.filters.splice(img.filters.indexOf(filter), 1);
                    this.VintageApplied = false;

                }
                break;
            default:
                img.filters.push(
                    new fabric.Image.filters.Grayscale());
                break;
        }
        img.applyFilters();

        this.Canvas.renderAll();

    }

    render(file, ctx) {
        var reader = new FileReader();
        var image = new Image();
        reader.onload = (fx => {
            return function (e) {
                image.onload = function () {
                    var imgInstance = new fabric.Image(image, {
                        left: 0,
                        top: 0,
                        angle: 0,
                        opacity: 1
                    });
                    ctx.add(imgInstance);
                    var text = new fabric.Text('#iStandWithAtiku', {
                        //fontFamily: 'Fira Sans',
                        left: 2,
                        top: 0,
                        fontSize: 20,
                        fill: '#ffffff',
                        fontWeight: 600,
                    });
                    ctx.add(text);
                    var logo = new fabric.Image.fromURL('images/pdp-logo.gif', function (img) {
                        img.scale(0.2);
                        ctx.add(img);
                    }, {
                        left: 230,
                        top: 3,
                        angle: 0,
                        opacity: 1
                    });
                };

                ctx.renderAll();
                image.src = e.target.result;
            };
        })(file); //here we pass f as fx to the onload function
        reader.readAsDataURL(file);


    }
}
