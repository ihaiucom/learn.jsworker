
export default class UnitData 
{
    id = 0;
    x = 0;
    y = 0;
    speed = 0.01;

    time = 0;
    update(dt: number)
    {
        this.time += dt;
        this.x += dt * this.speed;
        
        if(this.x > 5 || this.x < -5)
        {
            this.speed *= -1;
        }
    }
}