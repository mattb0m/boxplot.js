/* TODO: Fix clear button (does nothing) */

class boxplot {
    constructor(min, q1, q2, q3, max, title) {
        if(min > q1 || q1 > q2 || q2 > q3 || q3 > max)
            throw new Error('BoxPlot: Invalid 5-number summary');
        
        this.min = min;
        this.q1 = q1;
        this.q2 = q2;
        this.q3 = q3;
        this.max = max;
        this.title = title ? title : '';
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
    
    add_boxplot(min, q1, q2, q3, max, title) {
        this.boxplots.push(new boxplot(min, q1, q2, q3, max, title));
        this.draw();
    }
    
    /* draw a box plot at a specified starting pos */
    /* TODO: Validate limits */
    draw_boxplot_at(bp, ox, oy, w, h) {
        const PAD = 32;
        let y, ctx = this.ctx, uw = w/this.unitsx, min, q1, q2, q3, max;
        min = ((ox + bp.min*uw)|0) + 0.5;
        q1  = ((ox + bp.q1*uw )|0) + 0.5;
        q2  = ((ox + bp.q2*uw )|0) + 0.5;
        q3  = ((ox + bp.q3*uw )|0) + 0.5;
        max = ((ox + bp.max*uw)|0) + 0.5;
        
        ctx.font = '12px monospace';
        ctx.fillText(bp.title, ox, oy + PAD/2);
        oy += 12 + PAD;
        h  -= 12 + PAD;
        
        /* min and max */
        ctx.moveTo(min, oy);
        ctx.lineTo(min, oy + h);
        ctx.moveTo(max, oy);
        ctx.lineTo(max, oy + h);
        
        /* whiskers */
        y = (oy + (h/2)|0) + 0.5;
        ctx.moveTo(min, y);
        ctx.lineTo(q1, y);
        ctx.moveTo(q3, y);
        ctx.lineTo(max, y);
        
        /* quartiles */
        ctx.moveTo(q1, oy);
        ctx.lineTo(q1, oy + h);
        ctx.moveTo(q2, oy);
        ctx.lineTo(q2, oy + h);
        ctx.moveTo(q3, oy);
        ctx.lineTo(q3, oy + h);
        
        /* box */
        y = oy + 0.5;
        ctx.moveTo(q1, y);
        ctx.lineTo(q3, y);
        ctx.moveTo(q1, y + h);
        ctx.lineTo(q3, y + h);
    }
    
    clear() {
        let ctx = this.ctx, w = ctx.canvas.width, h = ctx.canvas.height, x = 0, y = 0;
        this.ctx.fillStyle = '#fff';
        ctx.clearRect(0, 0, w, h);
    }
    
    draw() {
        const PAD = 32, TICK_HEIGHT = 16, TITLE_H = 16;
        let ctx = this.ctx, w = ctx.canvas.width, h = ctx.canvas.height, x = 0, y = 0;
        
        /* calculate space available for plots */
        let plot_w, plot_h, plot_h_single, bplen = this.boxplots.length;
        plot_w = w - 1 - 2*PAD;
        plot_h = h - 1 - 4*PAD - TITLE_H - TICK_HEIGHT;
        plot_h_single = ((plot_h - this.boxplots.length*PAD)/this.boxplots.length)|0;
        
        /* resize canvas if insufficient height */
        if(plot_h_single > 0 && plot_h_single < 64) {
            ctx.canvas.height += (this.boxplots.length*64 - plot_h);
            h = ctx.canvas.height;
            plot_h = h - 1 - 4*PAD - TITLE_H - TICK_HEIGHT;
            plot_h_single = ((plot_h - this.boxplots.length*PAD)/this.boxplots.length)|0;
        }
        
        this.clear();
        
        /* draw graph title */
        ctx.font = '16px monospace';
        this.ctx.fillStyle = '#000';
        ctx.fillText(this.title, PAD, PAD);
        
        /* draw plots */
        ctx.beginPath();
        
        for(let i = 0; i < bplen; ++i) {
            y = PAD*2 + TITLE_H + i*(plot_h_single + PAD);
            this.draw_boxplot_at(this.boxplots[i], PAD, y, plot_w, plot_h_single);
        }
        
        /* draw x axis */
        ctx.font = '10px monospace';
        y = h - PAD - TICK_HEIGHT/2 - 0.5;
        ctx.moveTo(PAD, y);
        ctx.lineTo(w - 1 - PAD, y);
        
        /* draw all ticks but the last */
        for(let i = 0, tick_count = (this.unitsx/this.ticks_at)|0, uw = plot_w/this.unitsx; i <= tick_count; ++i) {
            x = ((PAD + i*this.ticks_at*uw)|0) + 0.5;
            ctx.moveTo(x, h - PAD - TICK_HEIGHT);
            ctx.lineTo(x, h - PAD);
            ctx.fillText((i*this.ticks_at).toString(), x, h - PAD/2);
        }
        
        /* refresh view */
        ctx.stroke();
    }
}