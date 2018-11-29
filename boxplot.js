/* TODO: Make sure there is room on the canvas before adding a new plot */
/* TODO: Fix clear button (does nothing) */

class boxplot {
    constructor(min, q1, q2, q3, max) {
        if(min > q1 || q1 > q2 || q2 > q3 || q3 > max)
            throw new Error('BoxPlot: Invalid 5-number summary');
        
        this.min = min;
        this.q1 = q1;
        this.q2 = q2;
        this.q3 = q3;
        this.max = max;
    }
}

class graph {
    constructor(canvas, unitsx, ticks_at, title) {
        this.ctx = canvas.getContext('2d');
        this.unitsx = unitsx;
        this.ticks_at = ticks_at;
        this.title = title;
        this.boxplots = [];
        this.draw();
    }
    
    add_boxplot(min, q1, q2, q3, max) {
        this.boxplots.push(new boxplot(min, q1, q2, q3, max));
        this.draw();
    }
    
    /* draw a box plot at a specified starting pos */
    /* TODO: Validate limits */
    draw_boxplot_at(bp, ox, oy, w, h) {
        let x, y, ctx = this.ctx, uw = w/this.unitsx;
        x = ((ox + bp.min*uw)|0) + 0.5;
        
        /* min */
        ctx.moveTo(x, oy);
        ctx.lineTo(x, oy + h);
        
        /* q1 */
        x = ((ox + bp.q1*uw)|0) + 0.5;
        ctx.moveTo(x, oy);
        ctx.lineTo(x, oy + h);
        
        /* left whisker */
        y = (oy + (h/2)|0) + 0.5;
        ctx.moveTo(((ox + bp.min*uw)|0) + 0.5, y);
        ctx.lineTo(x, y);
        
        /* q2 */
        x = ((ox + bp.q2*uw)|0) + 0.5;
        ctx.moveTo(x, oy);
        ctx.lineTo(x, oy + h);
        
        /* q3 */
        x = ((ox + bp.q3*uw)|0) + 0.5;
        ctx.moveTo(x, oy);
        ctx.lineTo(x, oy + h);
        
        /* box */
        y = oy + 0.5;
        ctx.moveTo((ox + bp.q1*uw)|0, y);
        ctx.lineTo((ox + bp.q3*uw)|0, y);
        ctx.moveTo((ox + bp.q1*uw)|0, y + h);
        ctx.lineTo((ox + bp.q3*uw)|0, y + h);
        
        /* right whisker */
        y = (oy + (h/2)|0) + 0.5;
        ctx.moveTo((ox + bp.q3*uw)|0, y);
        ctx.lineTo((ox + bp.max*uw)|0, y);
        
        /* max */
        x = ((ox + bp.max*uw)|0) + 0.5;
        ctx.moveTo(x, oy);
        ctx.lineTo(x, oy + h);
    }
    
    clear() {
        let ctx = this.ctx, w = ctx.canvas.width, h = ctx.canvas.height, x = 0, y = 0;
        this.ctx.fillStyle = '#fff';
        ctx.clearRect(0, 0, w, h);
    }
    
    draw() {
        const PAD = 32, TICK_HEIGHT = 16, TITLE_H = 16;
        let ctx = this.ctx, w = ctx.canvas.width, h = ctx.canvas.height, x = 0, y = 0;
        this.clear();
        
        /* draw graph title */
        ctx.font = '16px monospace';
        this.ctx.fillStyle = '#000';
        ctx.fillText(this.title, PAD, PAD);
        
        /* calculate space available for plots */
        let plot_w, plot_h, plot_h_single, bplen = this.boxplots.length;
        plot_w = w - 1 - 2*PAD;
        plot_h = h - 1 - 4*PAD - TITLE_H - TICK_HEIGHT;
        plot_h_single = ((plot_h - this.boxplots.length*PAD)/this.boxplots.length)|0;
        
        /* draw plots */
        ctx.beginPath();
        x = PAD;
        
        for(let i = 0; i < bplen; ++i) {
            y = PAD*2 + TITLE_H + i*(plot_h_single + PAD);
            this.draw_boxplot_at(this.boxplots[i], x, y, plot_w, plot_h_single);
        }
        
        /* draw x axis */
        y = h - PAD - TICK_HEIGHT/2 - 0.5;
        ctx.moveTo(PAD, y);
        ctx.lineTo(w - 1 - PAD, y);
        
        /* draw all ticks but the last */
        for(let i = 0, tick_count = (this.unitsx/this.ticks_at)|0, tick_spacing = ((w - PAD*2) / tick_count)|0; i < tick_count; ++i) {
            x = PAD + i*tick_spacing + 0.5;
            ctx.moveTo(x, h - PAD - TICK_HEIGHT);
            ctx.lineTo(x, h - PAD);
            ctx.fillText((i*this.ticks_at).toString(), x, h - PAD/2);
        }
        
        /* draw the last tick */
        x = w - 0.5 - PAD;
        ctx.moveTo(x, h - PAD - TICK_HEIGHT);
        ctx.lineTo(x, h - PAD);
        ctx.fillText(this.unitsx.toString(), x, h - PAD/2);
        
        /* refresh view */
        ctx.stroke();
    }
}