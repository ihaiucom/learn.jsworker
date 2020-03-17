
export default class UnitData 
{
    id = 0;
    x = 0;
    y = 0;
    speed: number = 1;

    time: number = 0;
    update(dt: number)
    {
        this.time += dt;
        this.x += dt * this.speed;
    }
}