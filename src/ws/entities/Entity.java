package ws.entities;

import ws.World;
import ws.tiles.TileModel;

public abstract class Entity {
	private final double N = 0.001;

	protected final EntityModel model;

	protected double speedX = 0;
	protected double speedY = 0;

	protected double x;
	protected double y;

	protected double rotation;

	protected boolean alive = true;

	protected Entity(EntityModel model, double x, double y) {
		this.model = model;
		this.x = x;
		this.y = y;
	}

	public final void setRotation(double value) {
		rotation = value;
	}

	public final double getRotation() {
		return rotation;
	}

	public final double getX() {
		return x;
	}

	public final double getY() {
		return y;
	}

	public final double getSpeedX() {
		return speedX;
	}

	public final double getSpeedY() {
		return speedY;
	}

	public final EntityModel getModel() {
		return model;
	}

	public final int getModelID() {
		return Entities.modelID(model);
	}

	public final void kill() {
		alive = false;
	}

	public final void tickMoves() {
		double friction = getFriction();

		speedX *= friction;
		speedY *= friction;

		x += speedX;

		if (x < 0) {
			speedX = 0;
			x = 0;
		} else if (x + model.getSize() > World.SIZE) {
			speedX = 0;
			x = World.SIZE - model.getSize() - N;
		}

		// Left collision check
		for (int blockY = (int) y; blockY <= (int) (y + model.getSize()); blockY++) {
			int blockX = (int) x;

			TileModel tile = World.getTile(blockX, blockY);

			if ((!tile.isWalkable() || !this.canWalk()) && (!tile.isFlyable() || !this.canFly())) {
				x = blockX + 1.0;
				speedX = 0;
			}
		}

		// Right collision check
		for (int blockY = (int) y; blockY <= (int) (y + model.getSize()); blockY++) {
			int blockX = (int) (x + model.getSize());

			TileModel tile = World.getTile(blockX, blockY);

			if ((!tile.isWalkable() || !this.canWalk()) && (!tile.isFlyable() || !this.canFly())) {
				x = blockX - model.getSize() - N;
				speedX = 0;
			}
		}

		y += speedY;

		if (y < 0) {
			speedY = 0;
			y = 0;
		} else if (y + model.getSize() > World.SIZE) {
			speedY = 0;
			y = Math.nextDown(World.SIZE - model.getSize());
		}

		// Up collision check
		for (int blockX = (int) x; blockX <= (int) (x + model.getSize()); blockX++) {
			int blockY = (int) y;

			TileModel tile = World.getTile(blockX, blockY);

			if ((!tile.isWalkable() || !this.canWalk()) && (!tile.isFlyable() || !this.canFly())) {
				y = blockY + 1.0;
				speedY = 0;
			}
		}

		// Down collision check
		for (int blockX = (int) x; blockX <= (int) (x + model.getSize()); blockX++) {
			int blockY = (int) (y + model.getSize());

			TileModel tile = World.getTile(blockX, blockY);

			if ((!tile.isWalkable() || !this.canWalk()) && (!tile.isFlyable() || !this.canFly())) {
				y = blockY - model.getSize() - N;
				speedY = 0;
			}
		}
	}

	public final void accel(double x, double y) {
		this.speedX += x;
		this.speedY += y;
	}

	public double getFriction() {
		return 0.9;
	}

	public final boolean isAlive() {
		return alive;
	}

	public boolean canFly() {
		return false;
	}

	public boolean canWalk() {
		return true;
	}

	@Override
	public final int hashCode() {
		return super.hashCode();
	}

	public void onTick() {

	}

	public void onCollision(Entity collidedEntity) {

	}

	public static void collide(final Entity e1, final Entity e2) {
		final double e1x = e1.x + e1.model.getSize() / 2;
		final double e1y = e1.y + e1.model.getSize() / 2;

		final double e2x = e2.x + e2.model.getSize() / 2;
		final double e2y = e2.y + e2.model.getSize() / 2;

		final double distX = e1x - e2x;
		final double distY = e1y - e2y;

		final double avgSize = (e1.model.getSize() + e2.model.getSize()) / 2;

		final double sqDist = distX * distX + distY * distY;

		if (sqDist > avgSize * avgSize) {
			return;
		}

		double moveSize = avgSize - Math.sqrt(sqDist);
		moveSize /= 32;

		double angle = Math.atan2(distX, distY);

		double impulseX = Math.sin(angle) * moveSize;
		double impulseY = Math.cos(angle) * moveSize;

		e1.accel(impulseX, impulseY);

		e2.accel(-impulseX, -impulseY);

		e1.onCollision(e2);
		e2.onCollision(e1);
	}
}
